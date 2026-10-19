const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const Module = require('node:module');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const { act } = Renderer;

const compile = (filename) => {
  const subject = new Module(filename, module);
  subject.filename = filename;
  subject.paths = Module._nodeModulePaths(path.dirname(filename));
  require.cache[filename] = subject;
  const { code } = babel.transformFileSync(filename, {
    configFile: false,
    babelrc: false,
    presets: [
      [require.resolve('@babel/preset-env'), { targets: { node: 'current' } }],
      require.resolve('@babel/preset-react'),
    ],
  });
  subject._compile(code, filename);
  return subject.exports;
};

require.extensions['.css'] = () => {};
const { AppProvider, useGlobalContext } = compile(
  path.resolve(__dirname, '../contexts/context.js')
);
const FormFour = compile(
  path.resolve(__dirname, '../components/MediaWizard/FormFour.js')
).default;

const movie = {
  selectedFile: { type: 'Movie', fs_path: '/media/movie.mkv' },
  selectedMetadata: {
    id: 123,
    title: 'Selected movie',
    release_date: '2020-01-02',
  },
};
const cases = [
  {
    name: 'movie selection reaches the movie endpoint before advancing',
    wizard: movie,
    endpoint: '/api/movies/add',
    fields: { id: 123, title: 'Selected movie', release_year: 2020 },
  },
  {
    name: 'song selection reaches the song endpoint with album metadata',
    wizard: {
      selectedFile: { type: 'Song', fs_path: '/media/song.mp3' },
      selectedMetadata: {
        album: {
          id: 'album-1',
          name: 'Selected album',
          release_date: '2021-02-03',
        },
        name: 'Selected song',
        disc_number: 1,
        track_number: 2,
      },
    },
    endpoint: '/api/music/songs/add',
    fields: { album_id: 'album-1', name: 'Selected song', track_number: 2 },
  },
  {
    name: 'unknown-album selection reaches the song endpoint',
    wizard: {
      selectedFile: { type: 'Song', fs_path: '/media/unknown.mp3' },
      selectedMetadata: null,
      unknownAlbum: true,
    },
    endpoint: '/api/music/songs/add',
    fields: { album_name: 'Unknown Album' },
  },
  {
    name: 'episode selection sends the parsed season and episode',
    wizard: {
      selectedFile: { type: 'Episode', fs_path: '/media/S02E03 episode.mkv' },
      selectedMetadata: { id: 456, name: 'Selected show' },
    },
    endpoint: '/api/tv/episodes/add',
    fields: {
      tv_show_id: 456,
      tv_show_name: 'Selected show',
      season_number: 2,
      episode_number: 3,
    },
  },
  {
    name: 'invalid episode filename stays on confirmation and reports the problem',
    wizard: {
      selectedFile: { type: 'Episode', fs_path: '/media/episode.mkv' },
      selectedMetadata: { id: 456, name: 'Selected show' },
    },
    noRequest: true,
    alert: /season and episode/,
  },
  {
    name: 'HTTP failure stays on confirmation and reports the problem',
    wizard: movie,
    endpoint: '/api/movies/add',
    status: 500,
    alert: /HTTP 500/,
  },
  {
    name: 'transport failure stays on confirmation and reports the problem',
    wizard: movie,
    endpoint: '/api/movies/add',
    disconnect: true,
    alert: /fetch failed/,
  },
];

for (const scenario of cases) {
  test(scenario.name, async (t) => {
    const requests = [];
    const server = http.createServer(async (request, response) => {
      let text = '';
      for await (const chunk of request) text += chunk;
      requests.push({
        path: request.url,
        method: request.method,
        body: JSON.parse(text),
      });
      if (scenario.disconnect) {
        response.destroy();
        return;
      }
      response.writeHead(
        request.url === scenario.endpoint ? scenario.status || 200 : 404,
        { 'Content-Type': 'application/json' }
      );
      response.end(JSON.stringify({ accepted: true }));
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const previousBase = process.env.REACT_APP_HOMEHOST_BASE;
    process.env.REACT_APP_HOMEHOST_BASE =
      'http://127.0.0.1:' + server.address().port;
    let context;
    function Observe() {
      context = useGlobalContext();
      return null;
    }
    let renderer;
    t.after(async () => {
      act(() => renderer.unmount());
      if (previousBase === undefined)
        delete process.env.REACT_APP_HOMEHOST_BASE;
      else process.env.REACT_APP_HOMEHOST_BASE = previousBase;
      await new Promise((resolve) => server.close(resolve));
    });
    act(() => {
      renderer = Renderer.create(
        React.createElement(
          AppProvider,
          null,
          React.createElement(Observe),
          React.createElement(FormFour)
        )
      );
    });
    act(() => {
      context.setMediaWizard({
        currentStep: 3,
        selectedMetadata: null,
        unknownAlbum: false,
        ...scenario.wizard,
      });
    });
    await act(async () => {
      await renderer.root
        .findAllByType('button')
        .find((button) => button.props.value === 'Next')
        .props.onClick();
    });
    assert.equal(context.mediaWizard.currentStep, scenario.alert ? 3 : 4);
    if (scenario.noRequest) {
      assert.equal(requests.length, 0);
    } else {
      assert.equal(requests.length, 1);
      assert.equal(requests[0].path, scenario.endpoint);
      assert.equal(requests[0].method, 'POST');
      assert.equal(
        requests[0].body.fs_path,
        scenario.wizard.selectedFile.fs_path
      );
      for (const [key, value] of Object.entries(scenario.fields || {})) {
        assert.equal(requests[0].body[key], value);
      }
    }
    if (scenario.alert) {
      const alert = renderer.root.findByProps({ role: 'alert' });
      assert.match(alert.children.join(''), scenario.alert);
    }
  });
}

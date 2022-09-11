const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apl',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const formatDate = (dateString) => {
  const arr = dateString.split('-');

  const year = arr[0];
  const month = months[parseInt(arr[1]) - 1];
  const day = arr[2].substring(0, 2);

  return `${month} ${day}, ${year}`;
};

export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = parseInt(((millis % 60000) / 1000).toFixed(0));
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export const useBar = (event, elmRef, callback) => {
  if (elmRef.current) {
    const right = elmRef.current.getBoundingClientRect().right;
    const left = elmRef.current.getBoundingClientRect().left;

    const { screen } = window;
    const { availLeft } = screen;
    const hostScreenX =
      event.screenX -
      availLeft +
      (availLeft ? screen.width - screen.availWidth : 0);
    const pos = hostScreenX; //event.screenX;

    const scale = right - left;
    const input = pos - left;
    const percent = Math.round((input * 100) / scale);

    callback(percent);
  }
};

export const millisToEnglishWords = (ms) => {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  let res = { days: d, hours: h, min: m, sec: s };
  res = Object.entries(res)
    .filter((piece) => piece[1] !== 0)
    .map((piece) => `${piece[1]} ${piece[0]}`)
    .join(', ');
  return res;
};

export const findTotalDurationMillis = (items) => {
  const sum = (acc, item) => {
    let add = 0;
    if (item.preview_url != null) {
      add = 30;
    }
    if (item.url_path != null) {
      add = item.duration_ms;
    }
    return acc + add;
  };
  return items.reduce((acc, item) => sum(acc, item), 0);
};

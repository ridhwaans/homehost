export const callApi = async (endpoint) => {
    const response = await fetch(endpoint);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

export function msToMS( ms ) {
    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = parseInt(seconds % 60);
    return (pad2(minutes)+":"+pad2(seconds));
}

function pad2(number) {
	return (number < 10 ? '0' : '') + number
}
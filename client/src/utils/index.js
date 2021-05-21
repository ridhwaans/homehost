const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apl",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  export const formatDate = (dateString) => {
    console.log(dateString);
    const arr = dateString.split("-");
  
    const year = arr[0];
    const month = months[parseInt(arr[1]) - 1];
    const day = arr[2].substring(0, 2);
  
    return `${month} ${day}, ${year}`;
  };

  export function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = parseInt(((millis % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };


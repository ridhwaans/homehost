module.exports = {

shuffleArr: (arr) => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr
},

findTotalDurationMillis: (items) => {
  const sum = (acc, item) => {
    let add = 0;
    if (item.preview_url != null){
      add = 30;
    }
    if (item.url_path != null){
      add = item.duration_ms;
    }
    return acc + add;
  }
  return items.reduce((acc, item) => sum(acc,item), 0)
}

}
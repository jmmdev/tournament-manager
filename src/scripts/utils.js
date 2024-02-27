export function getHMS(totalMilliseconds) {
  const date = new Date(totalMilliseconds);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${minutes <= 9 && hours === 0 ? '0' : ''}${hours * 60 + minutes}:${
    seconds <= 9 ? '0' : ''
  }${seconds}`;
}

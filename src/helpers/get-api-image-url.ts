export const getApiImageUrl = (
  width: Number,
  height: Number,
  isYoung = false,
  isGrayScale = false
) => {
  let requestUrl = ["https://placekeanu.com"];

  if (width) requestUrl.push(width.toString());
  if (height) requestUrl.push(height.toString());

  if (isYoung && isGrayScale) {
    requestUrl.push("yg");
  } else if (isYoung) {
    requestUrl.push("y");
  } else if (isGrayScale) {
    requestUrl.push("g");
  }

  return requestUrl.join("/");
};

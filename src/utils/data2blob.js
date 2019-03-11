/**
 * database64文件格式转换为2进制
 *
 * @param  {[String]} data dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
 * @return {[blob]}      [description]
 */
export default function(data) {
  const arr = data.split(',');
  let nData = arr[1];
  nData = window.atob(nData);
  const mime = arr[0].match(/:(.*?);/)[1];
  let ia = new Uint8Array(nData.length);
  for (let i = 0; i < nData.length; i++) {
    ia[i] = nData.charCodeAt(i);
  }
  return new Blob([ia], { type: mime });
}

export const getFileIndentation = (file: string): number => {
  let foundSpace = false;
  let nonSpace = false;
  let foundNewLine = false;
  
  let spaces = 0;
  let index = -1;
  
  while ((!nonSpace && !foundSpace) || (foundSpace && !nonSpace)) {
    const char = file[++index];
    if (char !== ' ') {
      if (foundSpace) {
        break;
      } else {
        if (char === '\n' || char === '\r') {
          foundNewLine = true;
        } else if (char === '{') {
          if (foundNewLine) {
            nonSpace = true;
          }
        } else {
          nonSpace = true;
        }
      }
    } else {
      ++spaces;
      foundSpace = true;
    }
    
    
  }
  
  return spaces;
}
// a = [
//   getFileIndentation('{\n  dddd:'), // 2
//   getFileIndentation('{\n   dddd:'), // 3
//   getFileIndentation('{\n  dd dd:'), // 2
//   getFileIndentation('{ \n  dddd:'), // 1
// ];

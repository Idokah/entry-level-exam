export default () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    const lengthArr: number[] = [8, 4, 4, 4, 12];
    for (let i = 0; i < lengthArr.length; i++) {
        for (let j = 0; j < lengthArr[i]; j++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        result += '-'
    }
    return result.slice(0, -1);
}
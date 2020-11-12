export const formNum =(value)=>{
    const k = 1000;
    const sizes = ['', 'K', 'M', 'G', 'T'];
    const i = Math.floor(Math.log(value) / Math.log(k));
    return {num: parseFloat((value / Math.pow(k, i))), text: sizes[i]};
} 

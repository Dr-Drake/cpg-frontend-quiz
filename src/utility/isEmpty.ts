const isEmpty = (value: string)=>{
    if (/^\s*$/.test(value)){
        return true;
    }
    if (value.length === 0){
        return true;
    }
    return false;
}
export default isEmpty;
const conversionEncodeTable = {
    "000000": "A", "010000": "Q", "100000": "g", "110000": "w",
    "000001": "B", "010001": "R", "100001": "h", "110001": "x",
    "000010": "C", "010010": "S", "100010": "i", "110010": "y",
    "000011": "D", "010011": "T", "100011": "j", "110011": "z",
    "000100": "E", "010100": "U", "100100": "k", "110100": "0",
    "000101": "F", "010101": "V", "100101": "l", "110101": "1",
    "000110": "G", "010110": "W", "100110": "m", "110110": "2",
    "000111": "H", "010111": "X", "100111": "n", "110111": "3",
    "001000": "I", "011000": "Y", "101000": "o", "111000": "4",
    "001001": "J", "011001": "Z", "101001": "p", "111001": "5",
    "001010": "K", "011010": "a", "101010": "q", "111010": "6",
    "001011": "L", "011011": "b", "101011": "r", "111011": "7",
    "001100": "M", "011100": "c", "101100": "s", "111100": "8",
    "001101": "N", "011101": "d", "101101": "t", "111101": "9",
    "001110": "O", "011110": "e", "101110": "u", "111110": "+",
    "001111": "P", "011111": "f", "101111": "v", "111111": "/"
}

const conversionDecodeTable = inverseObject(conversionEncodeTable)

const count = (string,sep) => {
    return string.split(sep).length-1
}

const zeropadding = (num, length) => {
    return ('0000000000' + num).slice(-length)
}

function inverseObject(obj,keyIsNumber) {
    return Object.keys(obj).reduceRight((ret,k) => {
        return (ret[obj[k]] = keyIsNumber ? parseInt(k,10) : k,ret)
    },{})
}

exports.encode = string => {
    const stringToBinary = Array.from((new TextEncoder('utf-16')).encode(string))
        .map(i => zeropadding(i.toString(2), 8)).join("")
    //base64の使用に従い最後は4ビット分0を追加する
    const sixBitSplit = []
    for (let i = 0; i < stringToBinary.length; i += 6) {
        sixBitSplit.push(stringToBinary.substr(i, 6))
    }
    //base64の使用に従い最後は4ビット分0を追加する
    if (6 > sixBitSplit[sixBitSplit.length - 1].length) {
        const addZero = 6 - sixBitSplit[sixBitSplit.length - 1].length
        sixBitSplit[sixBitSplit.length - 1] += '0'.repeat(addZero)
    }
    
    let stringToBase64 = []

    for(let i = 0;i<sixBitSplit.length;i+=4) {
        stringToBase64.push(sixBitSplit.slice(i,i+4).map(i => conversionEncodeTable[i]).join(''))
    }

    if (4 > stringToBase64[stringToBase64.length-1].length) {
        stringToBase64[stringToBase64.length-1] += '='.repeat(4 - (stringToBase64[stringToBase64.length-1].length))
    }

    return stringToBase64.join('')
}

exports.decode = string => {
    let stringSliceEqual = ''
    if (string.includes('=')) {
        const end = string.length - count(string,"=")
        console.log(end)
        stringSliceEqual = string.slice(0,end)
    }else{
        stringSliceEqual = string
    }
    
    //4つに切り出す
    const stringfourSlice = []
    for(let i = 0;i<stringSliceEqual.length;i+=4) {
        stringfourSlice.push(stringSliceEqual.substr(i,4))
    }

    const base64toBinary = stringfourSlice.map(i => 
        i.split("").map(s => conversionDecodeTable[s]).join('')
    ).join('')
    const hexArray = []
    for(let i =0;i<base64toBinary.length;i+=8) {
        hexArray.push(parseInt(base64toBinary.substr(i,8),2))
    }
    return new TextDecoder('utf-8').decode(Uint8Array.from(hexArray)).replace('\0','')
}

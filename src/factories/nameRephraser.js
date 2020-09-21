export default (name) => {
    if (name) {
        return name.split("").map((char, i) => {
            if(char === char.toUpperCase() && i > 0 && char !== "-") {
                return " " + char.toLowerCase()
            }
            else if(i === 0){
                return char.toUpperCase()
            }
            else if(char === "-"){
                return " "
            }
            else {
                return char
            }
        }).join("")
    }
}
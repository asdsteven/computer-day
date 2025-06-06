const baseUrl = "https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/#?body=Body_color_light&head=Human_child_light&sex=child&eye_color=Eye_Color_brown&eyes=Child_Eyes_brown";

const abbr = {
    jew: "Jewfro_black",
    rel: "Relm_Short_black",
    top: "Long_Topknot_2_black",
    wav: "Child_Wavy_black",
    bla: "black",
    blu: "blue",
    bro: "brown",
    gra: "gray",
    gre: "green",
    lav: "lavender",
    lig: "lightblue",
    pin: "pink",
    red: "red",
    whi: "white"
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function stretch(n, array) {
    shuffle(array);
    let result = [];
    while (result.length < n) {
        result = result.concat(array);
    }
    return shuffle(result.slice(0, n));
}

const n = 25;

const boyHairs  = ["jew", "rel"];
const girlHairs = ["top", "wav"];
const shirtColors = ["bla", "blu", "bro", "gra", "gre", "lav", "lig", "pin", "red", "whi"];
const pantsColors = ["bla", "blu", "bro", "gre", "lig", "red", "whi"];
const skirtColors = ["bla", "blu", "gre", "lav", "lig", "pin", "red", "whi"];
const hairs  = stretch(n, boyHairs).concat(stretch(n, girlHairs));
const shirts = stretch(n, shirtColors).concat(stretch(n, shirtColors));
const legs   = stretch(n, pantsColors).concat(stretch(n, skirtColors));
const legsPrefix = stretch(n, ["Child_pants_"]).concat(stretch(n, "Child_skirts_"));

for (let i = 0; i < 2*n; i++) {
    if (shirts[i] != legs[i]) {
        continue;
    }
    console.log(`Solving collision shirt ${shirts[i]} legs ${legs[i]}...`);
    let unlucky = 0;
    while (true) {
        const j = Math.floor(Math.random() * i);
        if (legs[j] == shirts[i] || shirts[j] == legs[i]) {
            console.log('unlucky');
            unlucky++;
            if (unlucky > 10) {
                exit();
            }
            continue;
        }
        [shirts[i], shirts[j]] = [shirts[j], shirts[i]];
        console.log('solved.');
        break;
    }
}

const links = [];
for (let i = 0; i < 2*n; i++) {
    links.push([
        baseUrl,
        "&hair=" + abbr[hairs[i]],
        "&clothes=Child_shirts_" + abbr[shirts[i]],
        "&legs=" + legsPrefix[i] + abbr[legs[i]],
        `\nlpc-${hairs[i]}-${shirts[i]}-${legs[i]}.png`
    ].join(""));
}

console.log(links.sort().join('\n'));

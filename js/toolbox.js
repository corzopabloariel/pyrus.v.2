function createClass(name,rules)
{
    let style = document.getElementsByTagName('style');
    if(!window.css)
        window.css = [];
    if(window.css.indexOf(name) < 0)
    {
        window.css.push(name);
        if(!style.length)
        {
            style = document.createElement(`style`);
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);
        } else
            style = style[0];
        if(!(style.sheet||{}).insertRule)
            (style.styleSheet || style.sheet).addRule(name, rules);
        else
            style.sheet.insertRule(name+"{"+rules+"}",0);
    }
}

/** -------------------------------------
 *      PREVIEW DE IMAGEN
 ** ------------------------------------- */
function readURL( input ) {
    if ( input.files && input.files[ 0 ] ) {
        let reader = new FileReader();
        reader.onload = ( e ) => {
            let image = document.getElementById(`image-${input.id}`);
            image.setAttribute("href", e.target.result);
        };
        reader.readAsDataURL( input.files[ 0 ] );
    }
}
/*
regexData = /([0-9]{4})-([0-9]{2})-([0-9]{4})/;
match = regexData.exec('2020-04-06'):

async-await 38
function obtener(id) {
    return new Promise((resolve, reject) => {
        $
            .get(url, {crossDomain: true}, function(data) {
                resolve(data);
            })
            .fail(() => reject(id))
    });
}
function onError(id) { console.log("ee"); }
var promesas = ids.map(id => obtener(id) );
Promise
    .all(promesas)
    .then(personajes => console.log(pesonajes))
    .catch(onError)
------------ closures
function x(x1) {
    return function(x2) {}
}
*/
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

function logKey(e) {
    if (e.charCode !== 13) {
        const property = e.srcElement.dataset.property;
        const element = e.currentTarget.element;
        element.empty[property] = e.target.value;
    }
}
/*
regexData = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;
match = regexData.exec('2020-04-06');
*/
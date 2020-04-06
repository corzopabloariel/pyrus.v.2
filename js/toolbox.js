const __img_not_found = "https://pablocorzo.dev/images/image-not-found.jpg";
window.pyrus_elements = [];
const id = document.getElementById.bind(document);
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
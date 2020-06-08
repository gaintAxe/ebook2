import { realPx } from './utils'
export const FONT_SIZE_LIST = [
    { fontSize: 12 },
    { fontSize: 14 },
    { fontSize: 16 },
    { fontSize: 18 },
    { fontSize: 20 },
    { fontSize: 22 },
    { fontSize: 24 }
];

export const FONT_FAMILY = [
    { font: 'Default' },
    { font: 'Cabin' },
    { font: 'Days One' },
    { font: 'Montserrat' },
    { font: 'Tangerine' }];

export const THEME_LIST = [
    {
        name: "default",
        style: {
            body: {
                color: "#000",
                background: "#fff"
            }
        }
    },
    {
        name: "eye",
        style: {
            body: {
                color: "#000",
                background: "#ceeaba"
            }
        }
    },
    {
        name: "night",
        style: {
            body: {
                color: "#fff",
                background: "#000"
            }
        }
    },
    {
        name: "glod",
        style: {
            body: {
                color: "#000",
                background: "rgb(241,236,226)"
            }
        }
    }
]

export function themeList(vue) {
    return [
        {
            alias: vue.$t('book.themeDefault'),
            name: "default",
            style: {
                body: {
                    'color': "#000",
                    'background': "#fff",
                    'padding-top': `${realPx(48)}px !important`,
                    'padding-bottom': `${realPx(48)}px !important`
                }
            }
        },
        {
            alias: vue.$t('book.themeEye'),
            name: "eye",
            style: {
                body: {
                    color: "#000",
                    background: "#ceeaba",
                    'padding-top': `${realPx(48)}px !important`,
                    'padding-bottom': `${realPx(48)}px !important`
                }
            }
        },
        {
            alias: vue.$t('book.themeNight'),
            name: "night",
            style: {
                body: {
                    color: "#fff",
                    background: "#000",
                    'padding-top': `${realPx(48)}px !important`,
                    'padding-bottom': `${realPx(48)}px !important`
                }
            }
        },
        {
            alias: vue.$t('book.themeGold'),
            name: "gold",
            style: {
                body: {
                    color: "#000",
                    background: "rgb(241,236,226)",
                    'padding-top': `${realPx(48)}px !important`,
                    'padding-bottom': `${realPx(48)}px !important`
                }
            }
        }
    ]
}



export function addCss(href) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', href);
    removeCss(href)
    document.getElementsByTagName('head')[0].appendChild(link)
}

export function removeCss(href) {
    const links = document.getElementsByTagName('link');
    for (let i = links.length; i >= 0; i--) {
        const link = links[i]
        if (link && link.getAttribute('href') && link.getAttribute('href').indexOf('theme/theme_') > -1) {
            link.parentNode.removeChild(link)
        }
    }
}
// 转为一维数组
export function flatten(array) {
    return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))));
}
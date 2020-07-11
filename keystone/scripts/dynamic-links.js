const dynamicPageScript = `
(() => {
  whenPageReady(() => {
    watchLinks()
    window.addEventListener('popstate', onPopState)
  })

  function watchLinks () {
    const links = document.querySelectorAll('a')
    for (const link of links) {
      link.addEventListener('click', linkClicked)
    }
  }

  function linkClicked (event) {
    if (linkAllowed(event.target)) {
      event.preventDefault()
      getPage(event.target.getAttribute('href')).then(newPage => {
        changePage(newPage, event.target.href)
      })
    }
  }

  function linkAllowed (target) {
    const sameHost = location.host === target.host
    const notSamePage =
      location.host + location.pathname + location.search !==
      target.host + target.pathname + target.search
    return sameHost && notSamePage
  }

  function changePage (newPage, url, popstate = false) {
    const state = getPageState()
    document.open()
    document.write(newPage)
    document.close()
    updateHistory(url, popstate, state)
  }

  function updateHistory (url, popstate, state) {
    if (!popstate) {
      history.pushState(state, document.title, url)
    } 
  }

  function getPageState () {
    const { x, y } = getScrollPos()
    return {
      scroll: {
        x,
        y
      }
    }
  }

  function getScrollPos () {
    const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
    const x = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0
    return { x: x, y: y }
  }

  function setScrollPos (x, y) {
    whenPageReady(() => {
      console.log('Scroll fix', x, y)
      window.scrollTo(x, y)
    })
  }

  function onPopState (event) {
    const lastUrl = location.href
    getPage(lastUrl).then(newPage => {
      changePage(newPage, lastUrl, true)
      setScrollPos(event.state.scroll.x, event.state.scroll.y)
    })
  }

  async function getPage (url) {
    try {
      return fetch(url)
        .then(response => response.text())
        .catch(() => console.log)
    } catch (err) { 
      console.log(err)
      window.location(url)
    }
  }

  function whenPageReady (func) {
    if (document.readyState === 'interactive' ||
      document.readyState === 'complete') {
      func()
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        func()
      })
    }
  }
})()`

const minVersion = 'function _createForOfIteratorHelper(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance. In order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,c=!0,l=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return c=t.done,t},e:function(t){l=!0,a=t},f:function(){try{c||null==n.return||n.return()}finally{if(l)throw a}}}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}!function(){function t(t){var n,o,a;n=t.target,o=location.host===n.host,a=location.host+location.pathname+location.search!==n.host+n.pathname+n.search,o&&a&&(t.preventDefault(),r(t.target.getAttribute("href")).then(function(n){e(n,t.target.href)}))}function e(t,e){var n,r,o,a=arguments.length>2&&void 0!==arguments[2]&&arguments[2],c=(n=function(){var t=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0;return{x:window.scrollX||document.documentElement.scrollLeft||document.body.scrollLeft||0,y:t}}(),r=n.x,o=n.y,{scroll:{x:r,y:o}});document.open(),document.write(t),document.close(),function(t,e,n){e||history.pushState(n,document.title,t)}(e,a,c)}function n(t){var n=location.href;r(n).then(function(r){var a,c;e(r,n,!0),a=t.state.scroll.x,c=t.state.scroll.y,o(function(){console.log("Scroll fix",a,c),window.scrollTo(a,c)})})}async function r(t){try{return fetch(t).then(function(t){return t.text()}).catch(function(){return console.log})}catch(e){console.log(e),window.location(t)}}function o(t){"interactive"===document.readyState||"complete"===document.readyState?t():document.addEventListener("DOMContentLoaded",function(){t()})}o(function(){!function(){var e,n=_createForOfIteratorHelper(document.querySelectorAll("a"));try{for(n.s();!(e=n.n()).done;){var r=e.value;r.addEventListener("click",t)}}catch(t){n.e(t)}finally{n.f()}}(),window.addEventListener("popstate",n)})}();'

module.exports = '<script>' + minVersion + '</script>'

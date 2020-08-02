module.exports = `
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
      const el = document.querySelector('.keystone-page-loading')
      showLoading(el)
      event.preventDefault()
      getPage(event.target.getAttribute('href')).then(newPage => {
        finishLoading(el)
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

  function showLoading (el) {
    if (el) {
      el.style.display = "block"
    }
  }

  function finishLoading (el) {
    if (el) {
      el.classList.add('keystone-page-loaded')
    }
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

  function getPage (url) {
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

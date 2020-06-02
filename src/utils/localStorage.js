import Storage from 'web-storage-cache'

const localStorage = new Storage();

export function setLocalStorage(key, value) {
  return localStorage.set(key, value);
}

export function getLocalStorage(key) {
  return localStorage.get(key)
}
export function removeLocalStorage(key) {
  return localStorage.delete(key)
}
export function clearLocalStorage() {
  return localStorage.clear()
}

export function setBookObject(filename, key, val) {
  let book = getLocalStorage(`${filename}-info`);
  if (!book) {
    book = {};
  }
  book[key] = val;
  setLocalStorage(`${filename}-info`, book)
}

export function getBookObject(filename, key) {
  let book = getLocalStorage(`${filename}-info`);
  // console.log('book',book)
  if (book) {
    return book[key];
  } else {
    return null;
  }
}

//获取字体
export function getFontFamily(filename) {
  return getBookObject(filename, 'fontFamily')
}
//保存字体
export function saveFontFamily(filename, font) {
  return setBookObject(filename, 'fontFamily', font)
}
//获取字号
export function getFontSize(filename) {
  return getBookObject(filename, 'fontSize')
}
//保存字号
export function saveFontSize(filename, fontSize) {
  return setBookObject(filename, 'fontSize', fontSize)
}
//获取当前语言
export function getLocale() {
  return getLocalStorage('locale')
}
//保存当前语言
export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}
//获取主题
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}
//保存主题
export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}
//获取进度
export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}
//保存进度
export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}
//获取当前电子书的阅读进度
export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}
//保存进度
export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}
//获取阅读时间
export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}
//设置阅读时间
export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}
//获取书签列表
export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}
//保存书签列表
export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}
//获取目录列表
export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}
//保存目录列表
export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}
//获取作品信息
export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}
//保存作品信息
export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}
//获取封面
export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}
//保存封面
export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}


//未使用的

export function getHome() {
  return getLocalStorage('home')
}

export function saveHome(home) {
  return setLocalStorage('home', home, 1800)
}





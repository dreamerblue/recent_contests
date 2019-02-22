function get(key: string): any {
  const storage = window.localStorage;
  try {
    return JSON.parse(storage.getItem(key) || '');
  } catch (err) {
    // console.error(err);
  }
  return null;
}

function set(key: string, value: any): boolean {
  const storage = window.localStorage;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(err);
  }
  return false;
}

function remove(key: string): boolean {
  const storage = window.localStorage;
  if (storage) {
    storage.removeItem(key);
    return true;
  }
  return false;
}

export default {
  get,
  set,
  remove,
};

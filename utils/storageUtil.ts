/**
 * Created by hjs on 2019-09-19
 */
import { merge } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyValuePair } from '@react-native-async-storage/async-storage/lib/typescript/types';

const storageUtil = {
  /**
   * Get a one or more value for a key or array of keys from AsyncStorage
   * @param {String|Array} key A key or array of keys
   * @return {Promise<any>}
   */
  async get(key: string | readonly string[]): Promise<any> {
    if (typeof key === "string") {
      return AsyncStorage.getItem(key).then(value => {
        return value ? JSON.parse(value) : null;
      });
    } else {
      return AsyncStorage.multiGet(key).then(values => {
        return values.map(value => {
          return value[1] ? JSON.parse(value[1]) : null;
        });
      });
    }
  },

  /**
   * Save a key value pair or a series of key value pairs to AsyncStorage.
   * @param  {String|Array} key The key or an array of key/value pairs
   * @param  {Any} value The value to save
   * @return {Promise<void>}
   */
  async save(keyOrPair: string | [string, any][], value?: any): Promise<void> {
    if (!Array.isArray(keyOrPair)) {
      return AsyncStorage.setItem(keyOrPair, JSON.stringify(value));
    } else {
      const pairs: [string, string][] = keyOrPair.map(function (pair) {
        return [pair[0], JSON.stringify(pair[1])];
      });
      return AsyncStorage.multiSet(pairs);
    }
  },

  /**
   * Updates the value in the store for a given key in AsyncStorage. If the value is a string it will be replaced. If the value is an object it will be deep merged.
   * @param  {String} key The key
   * @param  {Value} value The value to update with
   * @return {Promise<void>}
   */
  async update(key: string, value: any): Promise<void> {
    return storageUtil.get(key).then(item => {
      value = typeof value === 'string' ? value : merge({}, item, value);
      return AsyncStorage.setItem(key, JSON.stringify(value));
    });
  },

  /**
   * Delete the value for a given key in AsyncStorage.
   * @param  {String|Array} key The key or an array of keys to be deleted
   * @return {Promise<void>}
   */
  async delete(key: string | readonly string[]): Promise<void> {
    if (Array.isArray(key)) {
      return AsyncStorage.multiRemove(key);
    } else {
      return AsyncStorage.removeItem(key as string);
    }
  },

  /**
   * Get all keys in AsyncStorage.
   * @return {Promise<readonly string[]>} A promise which when it resolves gets passed the saved keys in AsyncStorage.
   */
  async keys(): Promise<readonly string[]> {
    return AsyncStorage.getAllKeys();
  },

  /**
   * Push a value onto an array stored in AsyncStorage by key or create a new array in AsyncStorage for a key if it's not yet defined.
   * @param {String} key They key
   * @param {Any} value The value to push onto the array
   * @return {Promise<void>}
   */
  async push(key: string, value: any): Promise<void> {
    return storageUtil.get(key).then(currentValue => {
      if (currentValue === null) {
        // if there is no current value populate it with the new value
        return storageUtil.save(key, [value]);
      }
      if (Array.isArray(currentValue)) {
        return storageUtil.save(key, [...currentValue, value]);
      }
      throw new Error(
        `Existing value for key "${key}" must be of type null or Array, received ${typeof currentValue}.`,
      );
    });
  },
};

export default storageUtil;
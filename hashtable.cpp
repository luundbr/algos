#include <iostream>
#include <memory>
#include <assert.h>
#include <optional>

class HashTable {
  public:
    std::unique_ptr<int[]> hashes;
    std::unique_ptr<std::string[]> values;

    int arraySize = 0;

    HashTable(int initSize) {
      this->hashes = std::make_unique<int[]>(initSize);    
      this->values = std::make_unique<std::string[]>(initSize);    

      for (int i = 0; i < initSize; i++) {
        this->hashes[i] = -1;
        this->values[i] = -1;
      }

      this->arraySize = initSize;
    }

    int hash(std::string data) {
      int h = 0;
      for (char c : data) {
        int ascii = (int) c;
        h = ((h << 5) - h) + ascii;
        h |= 0;
      }
      return h;
    }

    void add(std::string key, const std::string& value) { // value is passed by reference
      int h = this->hash(key);
      int idx = h % this->arraySize;

      int existingId = this->hashes[idx];

      if (existingId > 0) {
        this->values[idx] = value;
      } else {
        if (idx >= this->arraySize) {
          // resize the unique_ptr array to add one more elem
          std::unique_ptr<int[]> tempHashes = std::make_unique<int[]>(this->arraySize + 1); // new array with length + 1
          std::copy(&this->hashes[0], &this->hashes[this->arraySize], tempHashes.get()); // copy previous data
          this->hashes.reset(); // free original array memory
          this->hashes = std::move(tempHashes); // get an actual pointer from new array and assign to old reference

          std::unique_ptr<std::string[]> tempValues = std::make_unique<std::string[]>(this->arraySize + 1);
          std::copy(&this->values[0], &this->values[this->arraySize], tempValues.get());
          this->values.reset();
          this->values = std::move(tempValues);

          this->arraySize += 1;
        } else {
          this->hashes[idx] = h;
          this->values[idx] = value;
        }
      }
    }

    std::optional<std::string> get(std::string key) {
      int h = this->hash(key);
      int idx = h % this->arraySize;

      if (this->hashes[idx] == h) {
        return this->values[idx];
      }

      return std::optional<std::string>();
    }
  
};

int main() {
  HashTable* ht = new HashTable(16);

  ht->add("foo", "bar");
  ht->add("TEST", "HUI");

  assert(ht->get("foo").value() == "bar");
  ht->add("foo", "QWE");
  assert(ht->get("foo").value() == "QWE");
  assert(ht->get("qwe").value_or("FAIL") == "FAIL");
  assert(ht->get("TEST").value() == "HUI");
  assert(ht->get("TESTZ").value_or("FAIL") == "FAIL");
  
  return 0;
}

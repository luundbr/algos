#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <assert.h>

#define VAL_SIZE 32

int* hashes;
char** values;

int arraySize;

int getHash(char* data) {
  int hash = 0;

  for (int i = 0; i < strlen(data); i++) {
    char c = data[i];
    int c_ascii = (int) c;

    hash = ((hash << 5) - hash) + c_ascii;
    hash |= 0;
  }

  return hash;
}

void init(int size) {
  hashes = (int*) malloc(size * sizeof(int));
  values = (char**) malloc(size * sizeof(char *)); // arrayPtr -> stringPtr1, stringPtr2, ...

  for (int i = 0; i < size; i++) { // set the init keys/values all to -1
    hashes[i] = -1;
    values[i] = (char*) malloc(VAL_SIZE * sizeof(char)); // space for the string pointers

    for (int j = 0; j < VAL_SIZE; j++) { // set the strings to -1
      values[i][j] = -1;
    }

    arraySize++;
  }
}

void add(char* key, char* value) {
  int h = getHash(key);
  int idx = h % arraySize;

  int existingId = hashes[idx];

  if (existingId > 0) { // this key is already stored
    char* str = (char*) malloc(VAL_SIZE * sizeof(char));
    memcpy(str, value, VAL_SIZE);
    free(values[idx]);
    values[idx] = str;
  } else { // it's new
    if (idx >= arraySize) { // index points beyond the allocated array
      // add one element
      hashes = (int*) realloc(hashes, (arraySize + 1) * sizeof(int));
      values = (char**) realloc(values, (arraySize + 1) * sizeof(char*));

      // the new element is a string that needs to be allocated itself
      values[arraySize] = (char*) malloc(VAL_SIZE * sizeof(char));

      hashes[arraySize] = h;

      // set the new string
      memcpy(values[arraySize], value, VAL_SIZE);

      arraySize++;  
    } else { // index points inside the array
      hashes[idx] = h;

      // allocate and set the new string
      char* str = (char*) malloc(VAL_SIZE * sizeof(char));
      memcpy(str, value, VAL_SIZE);
      // delete the old string
      free(values[idx]);
      values[idx] = str;
    }
  }
}

char* get(char* key) {
  int h = getHash(key);
  int idx = h % arraySize;

  if (hashes[idx] == h) {
    return values[idx];
  }

  return NULL;
}

int main() {
  init(128);

  add("foo", "bar");
  add("TEST", "HUI");

  assert(strcmp(get("foo"), "bar") == 0);
  add("foo", "QWE");
  assert(strcmp(get("foo"), "QWE") == 0);
  assert(get("qwe") == NULL);
  assert(strcmp(get("TEST"), "HUI") == 0);
  assert(get("TESTZ") == NULL);

  return 0;
}

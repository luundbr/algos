#!/usr/bin/python3

def safeIdx(arr, idx):
    try:
        return arr[idx]
    except IndexError:
        return None


class HashTable:

    hashes = []
    values = []

    def __init__(self):
        for i in range(128):
            self.hashes.append(-i)
            self.values.append(-i)

    def hash(self, data):
        hash = 0

        for c in data:
            chr = ord(c)
            hash = ((hash << 5) - hash) + chr
            hash |= 0  # conv to 32bit int

        return hash

    def add(self, key, value):
        h = self.hash(key)
        idx = h % len(self.hashes)

        existingId = safeIdx(self.hashes, idx)

        existing = existingId == h

        if existing:
            self.values[idx] = value
        else:
            if idx >= len(self.hashes):
                self.hashes.append(h)
                self.values.append(value)
            else:
                self.hashes[idx] = h
                self.values[idx] = value

    def get(self, key):
        h = self.hash(key)
        idx = h % len(self.hashes)

        res = None

        if self.hashes[idx] == h:
            res = safeIdx(self.values, idx)

        return res


ht = HashTable()

ht.add('foo', 'bar')
ht.add('TEST', 'HUI')

assert ht.get('foo') == 'bar'
assert ht.get('qwe') is None
assert ht.get('TEST') == 'HUI'
assert ht.get('TESTZ') is None

struct HashTable {
    hashes: Vec<i32>,
    values: Vec<String>,
}

impl HashTable {
    fn new(init_size: i32) -> HashTable {
        let mut hashes: Vec<i32> = Vec::new();
        let mut values: Vec<String> = Vec::new();

        for _ in 0..init_size {
            hashes.push(-1);
            values.push("".to_string()); // how to use -1?
        }

        HashTable { hashes, values }
    }

    fn hash(&mut self, data: &String) -> i32 {
        let mut h: i32 = 0;

        for c in data.chars() {
            let ascii = c as i32;
            h = ((h << 5) - h) + ascii;
            h |= 0
        }

        h
    }

    fn add(&mut self, key: String, value: String) {
        let h: i32 = self.hash(&key);
        let idx: i32 = h % self.hashes.len() as i32;

        let existing_id: i32 = self.hashes[idx as usize];

        if existing_id >= 0 {
            self.values[idx as usize] = value;
        } else {
            if idx >= self.hashes.len() as i32 {
                self.hashes.push(h);
                self.values.push(value)
            } else {
                self.hashes[idx as usize] = h;
                self.values[idx as usize] = value
            }
        }
    }

    fn get(&mut self, key: String) -> Option<String> {
        let h: i32 = self.hash(&key);
        let idx: i32 = h % self.hashes.len() as i32;

        if self.hashes[idx as usize] == h {
            return Some(self.values[idx as usize].clone());
        }

        None
    }
}

fn main() {
    let mut ht: HashTable = HashTable::new(128);

    ht.add("foo".to_string(), "bar".to_string());
    ht.add("TEST".to_string(), "HUI".to_string());

    assert!(ht.get("foo".to_string()).unwrap() == "bar".to_string());
    ht.add("foo".to_string(), "QWE".to_string());
    assert!(ht.get("foo".to_string()).unwrap() == "QWE".to_string());
    assert!(ht.get("qwe".to_string()).is_none() == true);
    assert!(ht.get("TEST".to_string()).unwrap() == "HUI".to_string());
    assert!(ht.get("TESTZ".to_string()).is_none() == true);
}

class Filter {
  static byName(name: string) {
    return (person: Person) => person.name.toLowerCase() === name.toLowerCase();
  }

  static byId(id: number) {
    return (person: Person) => person.id === id;
  }

  static byString(s: string) {
    return (person: Person) =>
      person.name.toLowerCase().includes(s.toLowerCase());
  }
}

class Sort {
  static byName(person_1: Person, person_2: Person) {
    return person_1.name
      .toLowerCase()
      .localeCompare(person_2.name.toLowerCase());
  }
}

export { Filter, Sort };

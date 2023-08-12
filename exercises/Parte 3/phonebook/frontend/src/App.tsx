import { NotificationProvider } from "./context/NotificationProvider";
import { PersonProvider } from "./context/PersonProvider";
import AddPersonForm from "./features/AddPersonForm";
import PersonTable from "./features/PersonTable";

function App() {
  return (
    <div className="container px-4">
      <h1 className="my-1 font-bold text-xl">The Phonebook</h1>
      <NotificationProvider>
        <PersonProvider>
          <main>
            <AddPersonForm />
            <PersonTable />
          </main>
        </PersonProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;

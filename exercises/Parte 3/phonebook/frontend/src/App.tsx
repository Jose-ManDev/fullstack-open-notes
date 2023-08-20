import { NotificationProvider } from "./context/NotificationProvider";
import { PersonProvider } from "./context/PersonProvider";
import AddPersonForm from "./features/AddPersonForm";
import PersonList from "./features/PersonList";

function App() {
  return (
    <div className="relative container">
      <NotificationProvider>
        <PersonProvider>
          <main className="px-4 max-h-screen grid justify-center md:grid sm:grid-cols-3 sm:grid-row-2 sm:gap-6 sm:items-center">
            <h1 className="py-1 font-bold text-2xl sm:row-span-1 sm:col-span-3 sm:h-1/5">
              The Phonebook
            </h1>

            <AddPersonForm />
            <PersonList />
          </main>
        </PersonProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;

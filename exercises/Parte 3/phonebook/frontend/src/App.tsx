import { NotificationProvider } from "./context/NotificationProvider";
import { PersonProvider } from "./context/PersonProvider";
import AddPersonForm from "./features/AddPersonForm";
import PersonList from "./features/PersonList";

function App() {
  return (
    <div className="relative flex flex-col container h-screen mx-auto px-4">
      <NotificationProvider>
        <PersonProvider>
          <header className="h-1/6 flex items-center">
            <h1 className="py-1 font-bold text-2xl sm:col-span-3">
              The Phonebook
            </h1>
          </header>
          <main className="h-5/6 justify-center sm:flex-grow sm:grid sm:grid-cols-3 sm:gap-6 sm:items-center place-items-stretch">
            <div className="sm:h-full flex flex-col content-center justify-center">
              <AddPersonForm />
            </div>
            <PersonList />
          </main>
        </PersonProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;

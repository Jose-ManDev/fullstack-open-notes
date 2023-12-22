import UserProvider from "./components/UserProvider";
import NotificationProvider from "./components/NotificationProvider";
import LoginForm from "./features/LoginForm";
import BlogList from "./features/BlogList";
import NotificationList from "./features/NotificationList";

function App() {
  return (
    <NotificationProvider>
      <UserProvider>
        <div>
          <LoginForm />
          <BlogList />
        </div>
        <NotificationList />
      </UserProvider>
    </NotificationProvider>
  );
}

export default App;

import UserProvider from "./components/UserProvider";
import NotificationProvider from "./components/NotificationProvider";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";
import NotificationList from "./components/NotificationList";

function App() {
  return (
    <NotificationProvider>
      <UserProvider>
        <div>
          <LoginForm />
          <h2>Blogs</h2>
          <BlogList />
        </div>
        <NotificationList />
      </UserProvider>
    </NotificationProvider>
  );
}

export default App;

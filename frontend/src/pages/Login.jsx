import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, logout } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/google-login';
  };

  return (
    <div className="container">
      <div className="jumbotron">
        <img src="/images/google.png" height="50" style={{ display: 'block', margin: 'auto' }} alt="Google" />
        <br />
        <h1 style={{ textAlign: 'center', color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif" }}>Login Page</h1>
        <hr />
        {user ? (
          <>
            <br />
            <h4 style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>Welcome, {user.name}</h4>
            <br />
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <button onClick={logout} className="btn btn-dark btn-lg" style={{ textAlign: 'center', color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <br />
            <h4 style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>Click the button below to login with google:</h4>
            <br />
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <button onClick={handleGoogleLogin} className="btn btn-dark btn-lg" style={{ textAlign: 'center', color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>
                Login with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

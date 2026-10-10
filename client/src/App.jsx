import RoutesConfig from './Routes';

const App = () => {
  console.log('App Mounted');

  return (
    <>
      <div className="min-h-screen bg-background font-roboto text-base text-foreground">
        <RoutesConfig />
      </div>
    </>
  );
};

export default App;

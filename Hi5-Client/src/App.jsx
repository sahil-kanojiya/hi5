import RoutesConfig from './Routes';

const App = () => {
  console.log('App Mounted');

  return (
    <>
      <div className="bg-gray-100 font-roboto text-base text-black dark:bg-gray-900 dark:text-white">
        <RoutesConfig />
      </div>
    </>
  );
};

export default App;

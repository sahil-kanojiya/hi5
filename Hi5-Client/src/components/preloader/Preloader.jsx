import logo from '../../assets/images/logo/hi5.svg';

const Preloader = () => {
  console.log('Preloader');

  return (
    <div className="mx-auto flex h-screen w-screen bg-black p-4">
      <div className="flex flex-1 flex-col items-center justify-center">
        <img src={logo} alt="Hi5" className="w-1/6 sm:w-28 md:w-32 lg:w-36 xl:w-40" />
      </div>
    </div>
  );
};

export default Preloader;

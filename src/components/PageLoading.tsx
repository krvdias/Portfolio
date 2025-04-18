
const PageLoading = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white backdrop-blur-sm z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }
  
  export default PageLoading;
  
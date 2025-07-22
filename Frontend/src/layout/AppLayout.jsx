import Header from "./Header";
import Footer from "./Footer";

function AppLayout({children}){
    return(
        // 1f203d
        <div  className="" style={{ backgroundColor: '#03001C', color: 'white' , minHeight: '100vh' }}>
       <Header/>
        {children}
       <Footer/>
       </div>
        
        
       
    );
}

export default AppLayout;
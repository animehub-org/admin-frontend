import BasePage from "./BasePage.tsx";
import type {BaseProps, BaseState} from "../types/PageTypes.ts";

type HomePageState = BaseState & {

};

class Home extends BasePage<BaseProps, HomePageState>{
    protected renderContent(): React.ReactNode {
        return(
            <main>

            </main>
        )
    }

}
export default Home;
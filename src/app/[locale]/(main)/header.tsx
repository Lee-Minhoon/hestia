import Account from "./account";
import Navigations from "./navigations";
import Settings from "./settings";

export default function MainLayoutHeader() {
  return (
    <div className="flex py-4 border-b-1 items-center justify-center">
      <div className="flex w-content justify-between h-10">
        <Navigations />
        <div className="flex items-center gap-10">
          <Settings />
          <Account />
        </div>
      </div>
    </div>
  );
}

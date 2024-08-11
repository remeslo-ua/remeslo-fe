import ThemeSwitcher from "../common/ThemeSwitch";
import { PrimaryInput } from "../lib/primary/input/PrimaryInput";

const Picker = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Choose your preferences</h1>

      <PrimaryInput label="Flavors" options={["Mint", "Grape", "Watermelon"]} />

      <PrimaryInput label="Power" options={['strong', 'medium', 'light']} />
    </main>
  );
}

export default Picker;
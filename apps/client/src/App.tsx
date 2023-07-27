import Button from "./Global_Components/Buttons";
import FormRow from "./Global_Components/FormRow";
import FormBackdrop from "./Global_Components/FormBackdrop";
function App() {
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle input changes here
  };
  return (
    <div className="flex justify-center items-center h-screen bg-orange-100">
      <FormBackdrop onSubmit={handleFormSubmit}>
        <FormRow
          type="text"
          name="name"
          value=""
          handleChange={handleInputChange}
          labelText="Name:"
          placeholder="Hope Warren"
        />
        <FormRow
          type="email"
          name="email"
          value=""
          handleChange={handleInputChange}
          labelText="Email:"
          placeholder="hope@email.com"
        />
        {/* Add more form rows as needed */}
      </FormBackdrop>
    </div>
  );
}

export default App;

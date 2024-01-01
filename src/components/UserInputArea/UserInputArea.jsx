import UserInput from "./UserInput";

const DUMMY_INPUT = {
  startDate: "2023-01-01",
  endDate: "2023-12-31",
};

const UserInputArea = () => {
  const handleInputChange = () => {};
  return (
    <section id="user-input">
      <div className="input-group">
        <UserInput
          id="startDate"
          name="Data początkowa"
          type="date"
          value={DUMMY_INPUT.startDate}
          onChange={handleInputChange}
        />
        <UserInput
          id="endDate"
          name="Data końcowa"
          type="date"
          value={DUMMY_INPUT.endDate}
          onChange={handleInputChange}
        />
      </div>
    </section>
  );
};

export default UserInputArea;

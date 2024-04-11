const Customize = () => {
  return (
    <div class={"customize container"}>
      <h2>Customize</h2>

      <div class="flex justify-center">
        <div class="grid grid-flow-col gap-4">
          <div>
            <label for="select1" class="text-white">
              Spaceship
            </label>
            <select
              id="select1"
              class="border-2 border-purple-600 bg-transparent text-purple-600 p-2 rounded-md font-semibold"
            >
              <option value="A" class="select-option">
                A
              </option>
              <option value="B" class="select-option">
                B
              </option>
              <option value="C" class="select-option">
                C
              </option>
            </select>
          </div>

          <div>
            <label for="select2" class="text-white">
              Bullet
            </label>
            <select
              id="select2"
              class="border-2 border-purple-600 bg-transparent text-purple-600 p-2 rounded-md font-semibold"
            >
              <option value="A" class="select-option">
                A
              </option>
              <option value="B" class="select-option">
                B
              </option>
              <option value="C" class="select-option">
                C
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;

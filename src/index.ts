import Llama3InstructModel from "./impl/models/Llama3InstructModel";
import YesNoTask from "./impl/tasks/YesNoTask";

let testModel = Llama3InstructModel();

let test = YesNoTask();

test.setContext({
  YES: 'Yessss',
  NO: 'NoPEPEPEPEP',
});

test.addHistory('user', 'Hello bot. how are you');
test.addHistory('assistant', 'No.');

test.addHistory('user', 'Hello bot. how are you');
test.addHistory('assistant', '{NO}');

test.addHistory('user', 'Hello bot. how are you');
test.addHistory('assistant', 'No.');

test.addHistory('user', 'Hello bot. how are you');
test.addHistory('assistant', 'No.');

testModel.invoke(test, "Goodybe Bot. Sleep well.", {
  NO: 'Nope!',
  YES: 'Goodnight',
}).then(console.log);

testModel.invoke(test, "Goodybe Bot. Sleep well.").then(console.log);
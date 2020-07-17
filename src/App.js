import React from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
} from "shards-react";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

const IngredientRow = ({ id, errors, register }) => (
  <>
    <Col sm={3}>
      <FormInput
        placeholder="Amount"
        name={`ingredients[${id}].amount`}
        invalid={
          errors.ingredients &&
          errors.ingredients[id] &&
          !!errors.ingredients[id].amount
        }
        innerRef={register({ required: true })}
      />
    </Col>
    <Col sm={8}>
      <FormInput
        placeholder="Ingredient"
        name={`ingredients[${id}].ingredient`}
        invalid={
          errors.ingredients &&
          errors.ingredients[id] &&
          !!errors.ingredients[id].ingredient
        }
        innerRef={register({ required: true })}
      />
    </Col>
  </>
);

const StepRow = ({ id, errors, register }) => (
  <>
    <Col sm={11}>
      <FormInput
        placeholder="Step"
        name={`steps[${id}].step`}
        invalid={errors.steps && errors.steps[id] && !!errors.steps[id].step}
        innerRef={register({ required: true })}
      />
    </Col>
  </>
);

const createExpandoList = (key, name, RowComponent) => ({
  state,
  register,
  errors,
}) => {
  const [idList, idListSet] = React.useState(Object.keys(state[key]));

  const addItem = () => {
    idListSet([...idList, idList.length]);
  };

  const onDelete = (index) => {
    idListSet(idList.filter((i) => i !== index));
  };

  return (
    <>
      {idList.map((id) => (
        <Row style={{ marginTop: "1em" }} key={id}>
          <RowComponent id={id} register={register} errors={errors} />
          <Col sm={1}>
            <Button onClick={() => onDelete(id)}>Delete</Button>
          </Col>
        </Row>
      ))}
      <div style={{ marginTop: "1em" }}>
        <Button onClick={() => addItem()}>Add {name}</Button>
      </div>
    </>
  );
};

const IngredientList = createExpandoList(
  "ingredients",
  "Ingredient",
  IngredientRow
);
const StepsList = createExpandoList("steps", "Step", StepRow);

function RecipeForm({ startingState }) {
  const { register, errors, handleSubmit } = useForm({
    mode: "all",
    reValidate: "all",
    defaultValues: startingState,
  });

  const onSubmit = (data) => {
    console.log({
      ...data,
      ingredients: Object.values(data.ingredients),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container
        style={{
          padding: "1em",
          margin: "auto",
          width: 1200,
        }}
      >
        <InputGroup>
          <InputGroupAddon type="prepend">
            <InputGroupText>Recipe</InputGroupText>
          </InputGroupAddon>
          <FormInput
            placeholder="Recipe name"
            name="recipe"
            invalid={!!errors.recipe}
            innerRef={register({ required: true })}
          />
        </InputGroup>

        <IngredientList
          errors={errors}
          register={register}
          state={startingState}
        />
        <StepsList errors={errors} register={register} state={startingState} />

        <div style={{ marginTop: "1em" }}>
          <Button type="submit">Submit Recipe</Button>
        </div>
      </Container>
    </form>
  );
}

function App() {
  const [startingState, startingStateSet] = React.useState({
    recipe: "Cake",
    ingredients: [
      {
        amount: "1T",
        ingredient: "Baking soda",
      },
      {
        amount: "1C",
        ingredient: "Cake flour",
      },
    ],
    steps: [
      {
        step: "Set oven to 350",
      },
    ],
  });
  const [uniqueId, setUniqueId] = React.useState(1);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 20%)",
        }}
      >
        <Button
          pill
          type="success"
          onClick={() => {
            startingStateSet({
              recipe: "",
              steps: [],
              ingredients: [],
            });
            setUniqueId(uniqueId + 1);
          }}
        >
          Create New
        </Button>
        <Button
          pill
          onClick={() => {
            startingStateSet({
              recipe: "Cake",
              ingredients: [
                {
                  amount: "1T",
                  ingredient: "Baking soda",
                },
                {
                  amount: "1C",
                  ingredient: "Cake flour",
                },
              ],
              steps: [
                {
                  step: "Set oven to 350",
                },
              ],
            });
            setUniqueId(uniqueId + 1);
          }}
        >
          Load existing
        </Button>
      </div>
      <RecipeForm startingState={startingState} key={uniqueId} />
    </div>
  );
}

export default App;

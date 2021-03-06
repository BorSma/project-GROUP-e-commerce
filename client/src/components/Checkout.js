import React, { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../actions";
import { getStoreItemArray } from "../reducers/item-reducer";
import { COLORS } from "../constants";
const errorMessages = {
  "missing-data": "Oops!! Looks like we're missing some information.",
};
const initialState = {
  givenName: "",
  surname: "",
  email: "",
  fullName: "",
  phoneNumber: "",
  AddressLine1: "",
  AddressLine2: "",
  City: "",
  Province: "",
  Country: "",
  Postcode: "",
  CardNumber: "",
  ExpiryDate: "",
  CVC: "",
};

const Checkout = () => {
  const [formData, setFormData] = useState(initialState);
  const [disabled, setDisabled] = useState(false);
  const [cart, setCart] = useState(null);
  const [subStatus, setSubStatus] = useState("idle");
  const [dataReceived, setDataReceived] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const dispatch = useDispatch();  
  const newItems = useSelector(getStoreItemArray);
  console.log("newItems", newItems);
  const history = useHistory();

  useEffect(() => {
    Object.values(formData).includes("")
      ? setDisabled(true)
      : setDisabled(false);
  }, [cart, formData, setDisabled]);

  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
    setErrMessage("");
  };

  // const validateEmail = () => {
  //   const emailParts = formData.email.split("@");
  //   return (
  //     emailParts.length === 2 &&
  //     emailParts[0].length > 0 &&
  //     emailParts[1].length > 0
  //   );
  // };

  // const validateCardLength = () => {
  //   const cardLength = formData.CardNumber;
  //   return (
  //     cardLength.length === 16
  //   );
  // };

  // const validateExpiry = () => {
  //   const Expiry = formData.ExpiryDate;
  //   return (
  //     Expiry.length === 4
  //   );
  // };

  // const validateCVC= () => {
  //   const CVC = formData.CVC;
  //   return (
  //     CVC.length === 3
  //   );
  // };

  const handleSubmit = (ev) => {
    console.log("sss");
    ev.preventDefault();

    setSubStatus("pending");
    {
      fetch("/purchase", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, newItems }),
      })
        .then((response) => response.json())
        .then((response) => {
          const { status, error } = response;
          if (status === 200) {
            setDataReceived(response.data);
            localStorage.setItem("received", JSON.stringify(response.data));
            setSubStatus("confirmed");
            // history.push("/confirmation");
          } else if (error) {
            setSubStatus("error");
            setErrMessage(errorMessages[error]);
          }
          console.log("hey", response.data);
        });
    }
  };
  const totalCost = newItems.reduce(
    (sum, i) => (sum += i.quantity * parseFloat(i.price.replace(/[$,]+/g, ""))),
    0.0
  );

  return (
    <Wrapper33>
      {subStatus !== "confirmed" ? (
        <>
          <Logo
            src={require("../assets/checkout-banner (1).png")}
            alt="checkout"
          ></Logo>
          <WrapperHeader>
            <DetailsYour>Your details</DetailsYour>
            <DetailsYour>Your order</DetailsYour>
          </WrapperHeader>
          <MainWrapper>
            <Wrapper>
              <UserForm onSubmit={handleSubmit}>
                <Input
                  name="givenName"
                  placeholder="First Name"
                  type="text"
                  handleChange={handleChange}
                  value={formData.givenName}
                />
                <Input
                  name="surname"
                  placeholder="Last Name"
                  type="text"
                  handleChange={handleChange}
                  value={formData.surname}
                />
                <Input
                  name="email"
                  placeholder="Email"
                  type="email"
                  handleChange={handleChange}
                  value={formData.email}
                />{" "}
                <Input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  type="text"
                  handleChange={handleChange}
                  value={formData.phoneNumber}
                />
                <Input
                  name="AddressLine1"
                  placeholder="Address Line 1"
                  type="text"
                  handleChange={handleChange}
                  value={formData.AddressLine1}
                />
                <Input
                  name="City"
                  placeholder="City"
                  type="text"
                  handleChange={handleChange}
                  value={formData.City}
                />
                <Input
                  name="Province"
                  placeholder="Province"
                  type="text"
                  handleChange={handleChange}
                  value={formData.Province}
                />
                <Input
                  name="Country"
                  placeholder="Country"
                  type="text"
                  handleChange={handleChange}
                  value={formData.Country}
                />
                <Input
                  name="Postcode"
                  placeholder="Postcode"
                  type="text"
                  handleChange={handleChange}
                  value={formData.Postcode}
                />
                <Input
                  name="CardNumber"
                  placeholder="16 Digit Card Number"
                  type="number"
                  handleChange={handleChange}
                  value={formData.CardNumber}
                />
                <Input
                  name="ExpiryDate"
                  placeholder="Expiry Date MMYY"
                  type="number"
                  handleChange={handleChange}
                  value={formData.ExpiryDate}
                />
                <Input
                  name="CVC"
                  placeholder="3 Digit CVC Number"
                  type="number"
                  handleChange={handleChange}
                  value={formData.CVC}
                />{" "}
                <Button
                  // disabled={disabled}

                  handleClick={handleSubmit}
                  subStatus={subStatus}
                />
              </UserForm>
            </Wrapper>
            <Wrapper1>
              <List>
                {newItems &&
                  newItems.map((item) => {
                    return (
                      <Items key={item._id}>
                        <Header>
                          <Title>
                            <h3>{item.name} </h3>
                          </Title>
                          <Delete>
                            <DeleteButton
                              onClick={() => {
                                dispatch(removeItem(item._id));
                              }}
                            >
                              X
                            </DeleteButton>
                          </Delete>
                        </Header>
                        <ItemWrapper>
                          <ItemImg src={item.imageSrc} />
                          <ItemTotals>
                            <div>
                              <Price>{item.price}</Price>
                            </div>
                            <Quantity>
                              <InputQt
                                value={item.quantity}
                                onChange={(event) => {
                                  dispatch(
                                    updateQuantity({
                                      itemId: item._id,
                                      quantity: event.target.value,
                                    })
                                  );
                                }}
                              />
                            </Quantity>
                          </ItemTotals>
                        </ItemWrapper>
                      </Items>
                    );
                  })}
              </List>
              <Total>Total Price to Pay: ${totalCost.toFixed(2)}</Total>
            </Wrapper1>
          </MainWrapper>
          {subStatus === "error" && <ErrorMsg> {errMessage} </ErrorMsg>}
        </>
      ) : (
        history.push("/confirmation")
      )}
    </Wrapper33>
  );
};
export default Checkout;

const ErrorMsg = styled.div`
  display: flex;
  position: relative;
  top: -320px;
  margin-left: 30px;
  margin-right: 30px;
  border: 2px dashed red;
  height: 75px;
  width: 50%;
  justify-content: center;
  align-items: center;
  color: red;
  font-size: 20px;
`;
const Wrapper33 = styled.div``;
const Logo = styled.img`
  width: 100vw;
  display: flex;
`;
const WrapperHeader = styled.div`
  display: flex;
  border-style: solid;
  width: 100vw;
  justify-content: space-around;
  margin-top: 50px;
  margin-bottom: 50px;
`;
const DetailsYour = styled.div`
  font-size: 30px;
  display: flex;
  justify-content: center;
  color: ${COLORS.third};
`;
const MainWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 60px;
  width: 100vw;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-style: solid;
  width: 50vw;
`;
const UserForm = styled.div`
  border: 3px lightgray;
  border-radius: 5px;
  padding: 40px;
  width: 500px;
`;
const Wrapper1 = styled.div`
  display: flex;
  flex-direction: column;
  border-style: solid;
  width: 650px;
  align-content: left;
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
`;
const Items = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  border-bottom: lightgray 1px solid;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 40rem;
`;
const Title = styled.div``;
const Delete = styled.div``;
const DeleteButton = styled.button`
  background-color: white;
  border: none;
  border-radius: 20px;
  height: 25px;
  font-weight: bold;
  transition: 0.3s;
  &:hover {
    background-color: lightgray;
  }
`;
const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ItemImg = styled.img`
  max-height: 150px;
  max-width: 150px;
  border-radius: 10px;
`;
const ItemTotals = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Quantity = styled.div`
  padding: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
`;
const InputQt = styled.input`
  width: 20px;
  outline: none;
  border: none;
`;
const Price = styled.p`
  font-weight: bolder;
`;
const Total = styled.h2`
  display: flex;
  justify-content: flex-end;
  margin-top: 70px;
  color: ${COLORS.third};
`;

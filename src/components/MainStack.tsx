import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { DashboardScreen } from "./DashboardScreen";
import { AddTransactionScreen } from "./AddTransactionScreen";
import { useStore } from '../store/useStore';

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => {
    const { loadData } = useStore();

    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <BaseNavigationContainer>
            <StackNavigator.Navigator
                initialRouteName="Dashboard"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#000000",
                    },
                    headerTintColor: "#ffffff",
                }}
            >
                <StackNavigator.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <button
                                className="text-blue-500 mr-4"
                                onTap={() => navigation.navigate("AddTransaction")}
                            >
                                <label className="text-2xl">+</label>
                            </button>
                        ),
                    })}
                />
                <StackNavigator.Screen
                    name="AddTransaction"
                    component={AddTransactionScreen}
                    options={{
                        title: "Add Transaction"
                    }}
                />
            </StackNavigator.Navigator>
        </BaseNavigationContainer>
    );
};
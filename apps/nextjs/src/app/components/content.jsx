import React from 'react';

export function Content() {
  return (
    <>
      <div className="flex flex-col justify-center items-center pt-48">
        {/*Fix width */}
        <h1 className="text-black font-bold text-4xl max-w-l">
          Automate Restocks, Cut Costs, and Improve Productivity
        </h1>
        <p className="text-xl p-11 max-w-l">
          Track orders and inventory in real time so you never have to worry
          about having enough stock for life’s curve balls
        </p>
        <h2 className="text-black font-bold text-3xl pt-20">What is Slicer?</h2>
        <p className="text-xl p-11 max-w-md">
          Slicer is an inventory management software that takes away the stress
          of making sure that you and your team have enough stock to meet
          demands and avoid shortages. Slicer does the hard work for you so you
          can get back to what really matters.
        </p>
      </div>
      <div className="flex flex-row justify-center items-center pt-44 space-x-24">
        <div className="card w-96 shadow-xl rounded-lg border-2 border-blue-600">
          <div className="card-body p-3 h-32">
            <h2 className="card-title text-xl">Fast and Efficient</h2>
            <p>
              Inventory updates in real time so you and your team can see
              current stocks and there restock dates
            </p>
          </div>
        </div>
        <div className="card w-96 shadow-xl rounded-lg border-2 border-blue-600">
          <div className="card-body p-3 h-32">
            <h2 className="card-title text-xl">See Product Growth</h2>
            <p>Stuff</p>
          </div>
        </div>
        <div className="card w-96 shadow-xl rounded-lg border-2 border-blue-600">
          <div className="card-body p-3 h-32">
            <h2 className="card-title text-xl">Order Tracking and History</h2>
            <p>Stuff</p>
          </div>
        </div>
      </div>
    </>
  );
}

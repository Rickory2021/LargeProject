import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export function Content() {
  return (
    <>
      <div className="flex flex-col items-center pt-48">
        {/*Fix width */}
        <h1 className="text-black font-bold text-4xl max-w-l">
          Automate Restocks, Cut Costs, and Improve Productivity
        </h1>
        <p className="text-xl p-11 max-w-l">
          Track orders and inventory in real time so you never have to worry
          about having enough stock for life’s curve balls
        </p>
        <div className="w-1/4 pt-14">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Slicer? </AccordionTrigger>
              <AccordionContent>
                Slicer is a simple inventory manager for small businesses
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it free?</AccordionTrigger>
              <AccordionContent>
                Our basic tier is 100% free. We will never ask for your credit
                card
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Why choose us?</AccordionTrigger>
              <AccordionContent>
                Our interface is very easy to use and gives the user exactly the
                information they need at a glance
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center pt-40 space-x-24">
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
          <div className="card-body p-3 h-34">
            <h2 className="card-title text-xl">See Product Growth</h2>
            <p>
              Ever wonder how your stock totals, and orders fluctate month to
              month? Slicer shows users these changes with easy to interact with
              charts and tables.
            </p>
          </div>
        </div>
        <div className="card w-96 shadow-xl rounded-lg border-2 border-blue-600">
          <div className="card-body p-3 h-35">
            <h2 className="card-title text-xl">Order Tracking and History</h2>
            <p>
              Whenever you input your order totals, whether it be every day,
              week, even month. Slicer will automatically adjust your stock
              totals and keep track of when and who inputted the orders.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

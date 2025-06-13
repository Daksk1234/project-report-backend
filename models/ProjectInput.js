const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmiRowSchema = new Schema(
  {
    month: Number,
    openingBalance: Number,
    addition: Number,
    interest: Number,
    principal: Number,
    totalPayment: Number,
    closingBalance: Number,
  },
  { _id: false }
);

const ProjectInputSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },

    // 1. Core arrays/lists
    projectYears: [String],
    capacityUtilizationPerYear: [Number],
    manufacturedProducts: [
      {
        product: String,
      },
    ],

    // 2. Fixed-asset sections
    plantMachineryData: [
      {
        slNo: String,
        particular: String,
        supplier: String,
        quantity: Number,
        amount: Number,
      },
    ],
    plantContingencies: Number,
    plantGstPercent: Number,

    furnitureAndFixtures: [
      {
        slNo: String,
        particular: String,
        amount: Number,
      },
    ],

    otherFixedAssets: [
      {
        slNo: String,
        particular: String,
        amount: Number,
      },
    ],

    computers: [
      {
        slNo: String,
        particular: String,
        amount: Number,
      },
    ],

    preliminaryExpenses: [
      {
        slNo: String,
        particular: String,
        amount: Number,
      },
    ],

    depreciationData: [
      {
        particular: String,
        taxPercent: Number,
      },
    ],

    // 3. Cost & expense inputs
    costProjectInputs: {
      landDevelopment: Number,
      civilConstruction: Number,
      deposits: Number,
      termLoanPct: Number,
      equityPct: Number,
      workingCapitalPct: Number,
    },

    consumablesExpensePct: Number,

    manualConsumables: [
      {
        slno: String,
        particular: String,
        taxPercent: Number,
      },
    ],

    labourCost: [
      {
        typeOfWork: String,
        manpower: String,
        nos: Number,
        ratePerMonth: Number,
      },
    ],
    labourExtraPercent: Number,

    costOfProductionData: [
      {
        particular: String,
        percentage: Number,
      },
    ],

    rmConsumptionInputs: [
      {
        products: String,
        workingDays: Number,
        workingHoursPerDay: Number,
        outputPerHour: Number,
        operationPeriod: String,
      },
    ],

    rmConsumptionParticulars: [
      {
        slno: String,
        particular: String,
        product: String,
        quantity: String,
        price: Number,
      },
    ],

    powerSectionData: [
      {
        particular: String,
        value: String,
      },
    ],

    annualSalesRealisationInputs: [
      {
        product: String,
        avgSalePrice: Number,
        inventoryDays: Number,
      },
    ],

    workingCapitalRequirement: [
      {
        particular: String,
        days: Number,
      },
    ],

    workingCapitalInputs: {
      bankContribution: Number,
      interestOnCC: Number,
    },

    // 4. Financial projections & analyses
    projectedProfitabilityInputs: {
      leaseRent: Number,
      preliminaryExpensesWrittenOff: Number,
      sellingAndDistributionExpense: Number,
      incrementExpensePerYear: Number,
      provisionForTax: Number,
    },

    breakEvenAnalysisInputs: {
      sellingExpense: Number,
      fixedSellingExpense: Number,
    },

    balanceSheetInputs: {
      depositsB: Number,
      loanAndAdvances: Number,
    },

    otherCurrentAssetsByYear: [Number],
    projectedCashFlowFixedAssets: [Number],
    promoterDrawings: [Number],

    sensitivityScenario1: Number,
    sensitivityScenario2: Number,

    termLoanInput: {
      interestRate: Number,
      loanPeriod: Number,
      moratorium: Number,
      startMonth: String,
      pStartMonth: String,
      disbursements: [Number],
      emiSchedule: [EmiRowSchema],
    },

    netProfitBeforeTax: {
      type: [Number],
      default: [],
    },
    provisionForTax: {
      type: [Number],
      default: [],
    },
    netProfitAfterTax: {
      type: [Number],
      default: [],
    },
    sundryCreditor: {
      type: [Number],
      default: [],
    },
    sundryDebtors: {
      type: [Number],
      default: [],
    },
    totalAnnualSales: {
      type: [Number],
      default: [],
    },
    totalClosingStock: {
      type: [Number],
      default: [],
    },
    totalCostOfRawMaterial: {
      type: [Number],
      default: [],
    },
    averageCostOfProdPerMT: {
      type: [Number],
      default: [],
    },
    grandTotalCostOfProduction: {
      type: [Number],
      default: [],
    },
    workingCapitalRequirementData: {
      type: [Number],
      default: [],
    },
    workingCapitalBank: {
      type: [Number],
      default: [],
    },
    rawMaterials: {
      type: [Number],
      default: [],
    },
    finishedGoods: {
      type: [Number],
      default: [],
    },
    isFinalized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectInput', ProjectInputSchema);

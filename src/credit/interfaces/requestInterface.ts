/* eslint-disable no-prototype-builtins */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Request {
  client_id: string;
  requested_amount: number;
  term_months: number;
  annual_interest_rate: number;
  credit_type_id: string;
  status_id: string;
  approved_amount: number;
  approved_at: null;
  analyst_id: null;
  rejection_reason: null;
  risk_score: number;
  risk_assessment_details: RiskAssessmentDetails;
  purpose_description: string;
  applicant_contribution_amount: number;
  collateral_offered_description: string;
  collateral_value: number;
  number_of_dependents: number;
  other_income_sources: number;
  previous_defaults: number;
  created_at: Date;
  updated_at: Date;
  id: string;
  credit_type: CreditType;
  status: CreditType;
}

export interface CreditType {
  code: string;
  updated_at: Date;
  name: string;
  id: string;
  description: string;
  is_active: boolean;
  created_at: Date;
}

export interface RiskAssessmentDetails {
  age_calculated: number;
  monthly_payment: number;
  weights_applied: ScoresByCategory;
  final_risk_score: number;
  scores_by_category: ScoresByCategory;
  total_positive_score: number;
  payment_to_income_ratio: number;
}

export interface ScoresByCategory {
  collateral: number;
  debt_burden: number;
  demographics: number;
  credit_history: number;
  payment_capacity: number;
  agricultural_profile: number;
  loan_characteristics: number;
}

export class Convert {
  public static toRequest(json: string): Request {
    return cast(JSON.parse(json), r('Request'));
  }

  public static requestToJson(value: Request): string {
    return JSON.stringify(uncast(value, r('Request')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val,
    )}`,
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(', ')}]`;
    }
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = '',
  parent: any = '',
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent,
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val, key, parent);
  }
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Request: o([{ json: 'data', js: 'data', typ: r('Data') }], false),
  Data: o(
    [
      { json: 'client_id', js: 'client_id', typ: '' },
      { json: 'requested_amount', js: 'requested_amount', typ: 0 },
      { json: 'term_months', js: 'term_months', typ: 0 },
      { json: 'annual_interest_rate', js: 'annual_interest_rate', typ: 3.14 },
      { json: 'credit_type_id', js: 'credit_type_id', typ: '' },
      { json: 'status_id', js: 'status_id', typ: '' },
      { json: 'approved_amount', js: 'approved_amount', typ: null },
      { json: 'approved_at', js: 'approved_at', typ: null },
      { json: 'analyst_id', js: 'analyst_id', typ: null },
      { json: 'rejection_reason', js: 'rejection_reason', typ: null },
      { json: 'risk_score', js: 'risk_score', typ: 3.14 },
      {
        json: 'risk_assessment_details',
        js: 'risk_assessment_details',
        typ: r('RiskAssessmentDetails'),
      },
      { json: 'purpose_description', js: 'purpose_description', typ: '' },
      {
        json: 'applicant_contribution_amount',
        js: 'applicant_contribution_amount',
        typ: 0,
      },
      {
        json: 'collateral_offered_description',
        js: 'collateral_offered_description',
        typ: '',
      },
      { json: 'collateral_value', js: 'collateral_value', typ: 0 },
      { json: 'number_of_dependents', js: 'number_of_dependents', typ: 0 },
      { json: 'other_income_sources', js: 'other_income_sources', typ: 0 },
      { json: 'previous_defaults', js: 'previous_defaults', typ: 0 },
      { json: 'created_at', js: 'created_at', typ: Date },
      { json: 'updated_at', js: 'updated_at', typ: Date },
      { json: 'id', js: 'id', typ: '' },
      { json: 'credit_type', js: 'credit_type', typ: r('CreditType') },
      { json: 'status', js: 'status', typ: r('CreditType') },
    ],
    false,
  ),
  CreditType: o(
    [
      { json: 'code', js: 'code', typ: '' },
      { json: 'updated_at', js: 'updated_at', typ: Date },
      { json: 'name', js: 'name', typ: '' },
      { json: 'id', js: 'id', typ: '' },
      { json: 'description', js: 'description', typ: '' },
      { json: 'is_active', js: 'is_active', typ: true },
      { json: 'created_at', js: 'created_at', typ: Date },
    ],
    false,
  ),
  RiskAssessmentDetails: o(
    [
      { json: 'age_calculated', js: 'age_calculated', typ: 0 },
      { json: 'monthly_payment', js: 'monthly_payment', typ: 3.14 },
      {
        json: 'weights_applied',
        js: 'weights_applied',
        typ: r('ScoresByCategory'),
      },
      { json: 'final_risk_score', js: 'final_risk_score', typ: 3.14 },
      {
        json: 'scores_by_category',
        js: 'scores_by_category',
        typ: r('ScoresByCategory'),
      },
      { json: 'total_positive_score', js: 'total_positive_score', typ: 3.14 },
      {
        json: 'payment_to_income_ratio',
        js: 'payment_to_income_ratio',
        typ: 3.14,
      },
    ],
    false,
  ),
  ScoresByCategory: o(
    [
      { json: 'collateral', js: 'collateral', typ: 0 },
      { json: 'debt_burden', js: 'debt_burden', typ: 0 },
      { json: 'demographics', js: 'demographics', typ: 0 },
      { json: 'credit_history', js: 'credit_history', typ: 0 },
      { json: 'payment_capacity', js: 'payment_capacity', typ: 0 },
      { json: 'agricultural_profile', js: 'agricultural_profile', typ: 0 },
      { json: 'loan_characteristics', js: 'loan_characteristics', typ: 0 },
    ],
    false,
  ),
};

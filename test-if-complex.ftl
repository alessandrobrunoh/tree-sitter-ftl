<#if message.summary?keep_before(" ") == "accountUpdatedMessage" || message.summary == msg("accountUpdatedMessage")>
    <p>Condition met!</p>
<#elseif message.header?has_content>
    <p>Header is present!</p>
<#else>
    <p>Default case.</p>
</#if>
